import { Request, Response, NextFunction } from 'express';
import Log from '../models/Log';

export async function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.ip
    || req.socket.remoteAddress
    || 'unknown';

  // ::1 = IPv6 loopback, ::ffff: prefix = IPv4-mapped IPv6
  const clientIp = rawIp === '::1'
    ? '127.0.0.1'
    : rawIp.startsWith('::ffff:')
      ? rawIp.replace('::ffff:', '')
      : rawIp;

  res.on('finish', async () => {
    try {
      await Log.create({
        ip: clientIp,
        route: req.originalUrl,
        method: req.method,
        goal: req.body?.goal || '',
        status: String(res.statusCode),
        responseTime: Date.now() - start
      });
    } catch {}
  });
  next();
}