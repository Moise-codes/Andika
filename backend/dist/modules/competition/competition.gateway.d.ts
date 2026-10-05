import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class CompetitionGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private rooms;
    private userRooms;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    joinCompetition(client: Socket, data: {
        roomId: string;
        userId: string;
        username: string;
    }): Promise<void>;
    leaveCompetition(client: Socket, data: {
        roomId: string;
    }): Promise<void>;
    updateProgress(client: Socket, data: {
        roomId: string;
        userId: string;
        progress: number;
        wpm: number;
        accuracy: number;
    }): Promise<void>;
    finishCompetition(client: Socket, data: {
        roomId: string;
        userId: string;
        wpm: number;
        accuracy: number;
    }): Promise<void>;
    private startCompetition;
    private endCompetition;
    private leaveRoom;
}
