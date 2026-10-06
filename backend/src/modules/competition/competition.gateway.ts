import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface CompetitionRoom {
  id: string;
  participants: Map<string, any>;
  status: 'waiting' | 'started' | 'finished';
  startTime?: Date;
  duration: number;
  results: Map<string, any>;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
})
export class CompetitionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private rooms: Map<string, CompetitionRoom> = new Map();
  private userRooms: Map<string, string> = new Map();

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const roomId = this.userRooms.get(client.id);
    if (roomId) {
      this.leaveRoom(client, roomId);
    }
  }

  @SubscribeMessage('join-competition')
  async joinCompetition(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; username: string },
  ) {
    const { roomId, userId, username } = data;

    let room = this.rooms.get(roomId);
    
    if (!room) {
      room = {
        id: roomId,
        participants: new Map(),
        status: 'waiting',
        duration: 60, // Default 60 seconds
        results: new Map(),
      };
      this.rooms.set(roomId, room);
    }

    if (room.status !== 'waiting') {
      client.emit('error', { message: 'Competition already started' });
      return;
    }

    room.participants.set(userId, {
      socketId: client.id,
      username,
      progress: 0,
      wpm: 0,
      accuracy: 0,
      finished: false,
    });

    this.userRooms.set(client.id, roomId);
    client.join(roomId);

    this.server.to(roomId).emit('participant-joined', {
      userId,
      username,
      participantCount: room.participants.size,
    });

    // Auto-start when 4 participants join
    if (room.participants.size >= 4) {
      this.startCompetition(roomId);
    }
  }

  @SubscribeMessage('leave-competition')
  async leaveCompetition(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    this.leaveRoom(client, data.roomId);
  }

  @SubscribeMessage('update-progress')
  async updateProgress(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; progress: number; wpm: number; accuracy: number },
  ) {
    const room = this.rooms.get(data.roomId);
    if (!room || room.status !== 'started') return;

    const participant = room.participants.get(data.userId);
    if (participant) {
      participant.progress = data.progress;
      participant.wpm = data.wpm;
      participant.accuracy = data.accuracy;

      this.server.to(data.roomId).emit('progress-update', {
        userId: data.userId,
        progress: data.progress,
        wpm: data.wpm,
        accuracy: data.accuracy,
      });
    }
  }

  @SubscribeMessage('finish-competition')
  async finishCompetition(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; wpm: number; accuracy: number },
  ) {
    const room = this.rooms.get(data.roomId);
    if (!room) return;

    const participant = room.participants.get(data.userId);
    if (participant) {
      participant.finished = true;
      room.results.set(data.userId, {
        username: participant.username,
        wpm: data.wpm,
        accuracy: data.accuracy,
      });

      this.server.to(data.roomId).emit('participant-finished', {
        userId: data.userId,
        wpm: data.wpm,
        accuracy: data.accuracy,
      });

      // Check if all participants finished
      const allFinished = Array.from(room.participants.values()).every(p => p.finished);
      if (allFinished) {
        this.endCompetition(data.roomId);
      }
    }
  }

  private startCompetition(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = 'started';
    room.startTime = new Date();

    this.server.to(roomId).emit('competition-started', {
      duration: room.duration,
      startTime: room.startTime,
    });

    // Auto-end after duration
    setTimeout(() => {
      if (room.status === 'started') {
        this.endCompetition(roomId);
      }
    }, room.duration * 1000);
  }

  private endCompetition(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.status = 'finished';

    const results = Array.from(room.results.values())
      .sort((a, b) => b.wpm - a.wpm);

    this.server.to(roomId).emit('competition-ended', {
      results,
    });

    // Clean up room after 5 minutes
    setTimeout(() => {
      this.rooms.delete(roomId);
    }, 5 * 60 * 1000);
  }

  private leaveRoom(client: Socket, roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.participants.forEach((participant, userId) => {
        if (participant.socketId === client.id) {
          room.participants.delete(userId);
          this.server.to(roomId).emit('participant-left', { userId });
        }
      });

      this.userRooms.delete(client.id);
      client.leave(roomId);

      // If room is empty, delete it
      if (room.participants.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }
}
