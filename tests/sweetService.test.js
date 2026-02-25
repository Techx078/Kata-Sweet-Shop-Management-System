package com.HRMS.HRMS.service;

import com.HRMS.HRMS.dto.Notification.NotificationDto;
import com.HRMS.HRMS.entity.Employee;
import com.HRMS.HRMS.entity.Notification;
import com.HRMS.HRMS.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ModelMapper modelMapper;
    
    // Store active SSE connections mapped by Employee ID
    private final Map<Long, SseEmitter> userEmitters = new ConcurrentHashMap<>();

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, ModelMapper modelMapper){
        this.notificationRepository = notificationRepository;
        this.modelMapper = modelMapper;
    }

    // --- NEW: Subscribe to SSE ---
    public SseEmitter subscribe(Long empId) {
        // Set timeout to 1 hour (or -1L for infinite)
        SseEmitter emitter = new SseEmitter(60 * 60 * 1000L); 
        
        userEmitters.put(empId, emitter);

        // Clean up when the connection is closed or times out
        emitter.onCompletion(() -> userEmitters.remove(empId));
        emitter.onTimeout(() -> userEmitters.remove(empId));
        emitter.onError((e) -> userEmitters.remove(empId));

        return emitter;
    }

    public void sendNotification(Employee recipient, String message, String type, Long referenceId) {
        // 1. Save to Database
        Notification notification = new Notification();
        notification.setUser(recipient);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReferenceId(referenceId);
        notification.setRead(false);
        Notification savedNotification = notificationRepository.save(notification);
        
        log.info("Notification sent to " + notification.getUser().getEmail() + " of type " + notification.getType());

        // 2. Push to real-time stream if user is online
        SseEmitter emitter = userEmitters.get(recipient.getId());
        if (emitter != null) {
            try {
                NotificationDto dto = modelMapper.map(savedNotification, NotificationDto.class);
                // Send an event named "new-notification" containing the DTO as JSON
                emitter.send(SseEmitter.event().name("new-notification").data(dto));
            } catch (IOException e) {
                userEmitters.remove(recipient.getId());
                log.error("Failed to send SSE to user " + recipient.getId(), e);
            }
        }
    }

    // ... (keep your existing findByUserIdOrderByCreatedAtDesc, markAsRead, getUnreadCount methods)
                               }
  import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

// ... inside your NotificationController ...

    // The produces = MediaType.TEXT_EVENT_STREAM_VALUE is critical for SSE!
    @GetMapping(value = "/stream/{empId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamNotifications(@PathVariable Long empId) {
        return notificationService.subscribe(empId);
  }
   import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Loader } from "../../components/ui/Loader";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getAllNotifications,
  marksAsRead,
} from "../../Services/NotificationService";
import { handleGlobalError } from "../../Services/GlobalExceptionService";

const NotificationPage = () => {
  const { userId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch initial historical notifications
    fetchNotifications();

    // 2. Open the Server-Sent Events connection
    // IMPORTANT: Replace this URL with your actual backend base URL if it's different
    const sseUrl = `http://localhost:8080/api/notifications/stream/${userId}`;
    const eventSource = new EventSource(sseUrl);

    // 3. Listen for the specific "new-notification" event we named in Spring Boot
    eventSource.addEventListener("new-notification", (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        
        // Add the new notification to the TOP of the list dynamically
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        
        // Optional: Show a toast to alert the user immediately
        toast.info(newNotification.message);
      } catch (error) {
        console.error("Error parsing SSE data", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("SSE connection error", error);
      eventSource.close();
    };

    // 4. Cleanup: Close the connection when the user leaves the page
    return () => {
      eventSource.close();
    };
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await getAllNotifications(userId);
      setNotifications(res.data);
    } catch (error) {
      handleGlobalError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (id, read) => {
    if (read) return;
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      await marksAsRead(id);
    } catch (error) {
      handleGlobalError(error);
    }
  };

  // ... (Your return statement and UI styling remain exactly the same)
  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen bg-white">
      {/* ... keeping your existing UI layout ... */}
    </div>
  );
};

export default NotificationPage;
        
