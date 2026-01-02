import { useEffect, useCallback } from 'react';
import { wsService } from '../services/websocket';
import type { WebSocketMessage } from '../types';

export const useWebSocket = (event: string, callback: (data: WebSocketMessage) => void) => {
  useEffect(() => {
    wsService.connect();
    wsService.on(event, callback);

    return () => {
      wsService.off(event, callback);
    };
  }, [event, callback]);
};

export const useCSVUpdates = (onUpdate: () => void) => {
  const handleUpdate = useCallback((data: WebSocketMessage) => {
    if (data.event === 'csv_list_updated') {
      onUpdate();
    }
  }, [onUpdate]);

  useWebSocket('csv_list_updated', handleUpdate);
};
