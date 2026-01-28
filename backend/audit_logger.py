import logging
import uuid
from datetime import datetime
from typing import List, Optional
from threading import Lock
from .models import AuditLog

class AuditLogger:
    def __init__(self):
        self._logs: List[AuditLog] = []
        self._lock = Lock()
        
        # Also setup standard python logger for file/console output
        self.logger = logging.getLogger("med_audit")
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log_event(
        self, 
        user_id: str, 
        operation: str, 
        details: str, 
        resource_id: Optional[str] = None,
        ip_address: Optional[str] = None
    ):
        """
        Record an immutable audit event.
        """
        event = AuditLog(
            id=str(uuid.uuid4()),
            timestamp=datetime.now(),
            user_id=user_id,
            operation=operation,
            details=details,
            resource_id=resource_id,
            ip_address=ip_address
        )
        
        with self._lock:
            self._logs.append(event)
            # Cap logs in memory (in production this would go to a secure DB or WORM storage)
            if len(self._logs) > 1000:
                self._logs = self._logs[-1000:]
        
        self.logger.info(f"AUDIT | User: {user_id} | Op: {operation} | Details: {details}")
        return event

    def get_logs(self, limit: int = 100) -> List[AuditLog]:
        with self._lock:
            return sorted(self._logs, key=lambda x: x.timestamp, reverse=True)[:limit]

# Global Audit Instance
audit_logger = AuditLogger()
