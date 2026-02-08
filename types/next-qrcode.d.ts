declare module 'next-qrcode' {
    import { FC } from 'react';

    interface QRCodeOptions {
        type?: 'image/png' | 'image/jpeg' | 'image/webp';
        quality?: number;
        level?: 'L' | 'M' | 'Q' | 'H';
        margin?: number;
        scale?: number;
        width?: number;
        color?: {
            dark?: string;
            light?: string;
        };
        errorCorrectionLevel?: string;
    }

    interface CanvasProps {
        text: string;
        options?: QRCodeOptions;
        logo?: {
            src: string;
            options?: {
                width: number;
                x?: number;
                y?: number;
            };
        };
    }

    export const useQRCode: () => {
        Canvas: FC<CanvasProps>;
        Image: FC<CanvasProps>;
    };
}
