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
exports.TypingController = void 0;
const common_1 = require("@nestjs/common");
const typing_service_1 = require("./typing.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TypingController = class TypingController {
    constructor(typingService) {
        this.typingService = typingService;
    }
    async createSession(user, createDto) {
        return this.typingService.createSession(user.id, createDto);
    }
    async getSessions(user) {
        return this.typingService.getSessions(user.id);
    }
    async getRecentSessions(user) {
        return this.typingService.getRecentSessions(user.id, 10);
    }
    async completeSession(user, id, resultDto) {
        return this.typingService.completeSession(user.id, id, resultDto);
    }
    async getResult(id) {
        return this.typingService.getResult(id);
    }
    async getResultAnalysis(id) {
        return this.typingService.getResultAnalysis(id);
    }
};
exports.TypingController = TypingController;
__decorate([
    (0, common_1.Post)('sessions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/recent'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getRecentSessions", null);
__decorate([
    (0, common_1.Post)('sessions/:id/complete'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "completeSession", null);
__decorate([
    (0, common_1.Get)('results/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getResult", null);
__decorate([
    (0, common_1.Get)('results/:id/analysis'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TypingController.prototype, "getResultAnalysis", null);
exports.TypingController = TypingController = __decorate([
    (0, common_1.Controller)('typing'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [typing_service_1.TypingService])
], TypingController);
//# sourceMappingURL=typing.controller.js.map