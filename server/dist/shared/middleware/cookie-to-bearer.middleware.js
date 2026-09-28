var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let CookieToBearerMiddleware = class CookieToBearerMiddleware {
    use(req, _res, next) {
        if (req.headers.authorization)
            return next();
        if (!req.cookies || typeof req.cookies !== 'object')
            return next();
        const useRefreshToken = this._shouldUseRefreshToken(req);
        const tokenKey = useRefreshToken ? 'refresh_token' : 'access_token';
        const token = req.cookies[tokenKey];
        if (!token)
            return next();
        req.headers.authorization = `Bearer ${token}`;
        next();
    }
    _shouldUseRefreshToken(req) {
        const rf = req.query.rf;
        return rf === 'true' || rf === '1';
    }
};
CookieToBearerMiddleware = __decorate([
    Injectable()
], CookieToBearerMiddleware);
export { CookieToBearerMiddleware };
//# sourceMappingURL=cookie-to-bearer.middleware.js.map