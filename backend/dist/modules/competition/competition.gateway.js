"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompetitionGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let CompetitionGateway = class CompetitionGateway {
    constructor() {
        this.rooms = new Map();
        this.userRooms = new Map();
    }
    async handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
    }
    async handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        const roomId = this.userRooms.get(client.id);
        if (roomId) {
            this.leaveRoom(client, roomId);
        }
    }
    async joinCompetition(client, data) {
        const { roomId, userId, username } = data;
        let room = this.rooms.get(roomId);
        if (!room) {
            room = {
                id: roomId,
                participants: new Map(),
                status: 'waiting',
                duration: 60,
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
        if (room.participants.size >= 4) {
            this.startCompetition(roomId);
        }
    }
    async leaveCompetition(client, data) {
        this.leaveRoom(client, data.roomId);
    }
    async updateProgress(client, data) {
        const room = this.rooms.get(data.roomId);
        if (!room || room.status !== 'started')
            return;
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
    async finishCompetition(client, data) {
        const room = this.rooms.get(data.roomId);
        if (!room)
            return;
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
            const allFinished = Array.from(room.participants.values()).every(p => p.finished);
            if (allFinished) {
                this.endCompetition(data.roomId);
            }
        }
    }
    startCompetition(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.status = 'started';
        room.startTime = new Date();
        this.server.to(roomId).emit('competition-started', {
            duration: room.duration,
            startTime: room.startTime,
        });
        setTimeout(() => {
            if (room.status === 'started') {
                this.endCompetition(roomId);
            }
        }, room.duration * 1000);
    }
    endCompetition(roomId) {
        const room = this.rooms.get(roomId);
        if (!room)
            return;
        room.status = 'finished';
        const results = Array.from(room.results.values())
            .sort((a, b) => b.wpm - a.wpm);
        this.server.to(roomId).emit('competition-ended', {
            results,
        });
        setTimeout(() => {
            this.rooms.delete(roomId);
        }, 5 * 60 * 1000);
    }
    leaveRoom(client, roomId) {
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
            if (room.participants.size === 0) {
                this.rooms.delete(roomId);
            }
        }
    }
};
exports.CompetitionGateway = CompetitionGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], CompetitionGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-competition'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], CompetitionGateway.prototype, "joinCompetition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leave-competition'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], CompetitionGateway.prototype, "leaveCompetition", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('update-progress'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], CompetitionGateway.prototype, "updateProgress", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('finish-competition'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], CompetitionGateway.prototype, "finishCompetition", null);
exports.CompetitionGateway = CompetitionGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        },
    })
], CompetitionGateway);
//# sourceMappingURL=competition.gateway.js.map