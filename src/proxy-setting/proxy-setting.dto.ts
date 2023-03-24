import { ApiProperty } from '@nestjs/swagger';

export class ProxySettingDTO {
    @ApiProperty({
        description: 'Proxy id',
    })
    id: number;

    @ApiProperty({
        description: 'Proxy type',
    })
    type: string;

    @ApiProperty({
        description: 'User agent',
    })
    agent: string;

    @ApiProperty({
        description: 'Proxy port',
    })
    port: string;
    @ApiProperty({
        description: 'Proxy ip',
    })
    ip: string;
    @ApiProperty({
        description: 'Username for access',
    })
    userName: string;
    @ApiProperty({
        description: 'User password for access',
    })
    userPwd: string;
}

export class GetProxySettingsResponseDTO {
    @ApiProperty({
        description: 'Proxy settings list',
    })
    items: ProxySettingDTO[];
}

export class DeleteProxySettingsRequestDTO {
    @ApiProperty({
        description: 'Reason for delete settings',
    })
    reason: string;
}
