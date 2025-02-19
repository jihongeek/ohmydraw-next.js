'use client';
import { useEffect } from 'react';

async function initMsw() {
  if (typeof window === 'undefined') {
    const { server } = import('../../../mocks/node');
    server.listen();
  } else {
    const { worker } = await import('../../../mocks/browser');
    await worker.start();
  }
}

export function MswComponent({ children }) {
  useEffect(() => {
    initMsw();
  }, []);
  return <>{children}</>;
}
