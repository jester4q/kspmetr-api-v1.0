import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

import { AuthTokensService, TSessionUser } from './authToken.service';
import { Injectable } from '@nestjs/common';

import passport = require('passport');
import express = require('express');

class Strategy extends passport.Strategy {
    public readonly name: string = 'token';

    constructor(private tokenService: AuthTokensService) {
        super();
    }

    public authenticate(req: express.Request, options?: any) {
        var token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        this.tokenService
            .verify(token)
            .then((result) => {
                if (!result) {
                    this.fail(result);
                } else {
                    this.success(result);
                }
            })
            .catch((error) => {
                this.fail(error);
            });
    }
}

@Injectable()
export class AuthTokenStrategy extends PassportStrategy(Strategy) {
    constructor(tokenService: AuthTokensService) {
        super(tokenService);
    }

    async validate(payload: TSessionUser) {
        return payload;
    }
}
