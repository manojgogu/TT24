package com.campus.emergency.service;

import com.campus.emergency.dto.NotificationDto;
import com.campus.emergency.entity.EmergencyReport;
import com.campus.emergency.entity.Notification;
import com.campus.emergency.entity.User;
import com.campus.emergency.enums.Role;
import com.campus.emergency.exception.ResourceNotFoundException;
import com.campus.emergency.exception.UnauthorizedException;
import com.campus.emergency.repository.NotificationRepository;
import com.campus.emergency.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final AuthService authService;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               AuthService authService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @Transactional
    public Notification createNotification(User recipient, EmergencyReport emergency, String message, String type) {
        Notification notification = new Notification(recipient, emergency, message, type);
        return notificationRepository.save(notification);
    }

    @Transactional
    public void notifyAllAdmins(EmergencyReport emergency, String message, String type) {
        List<User> admins = userRepository.findByRoleAndActiveTrue(Role.ADMIN);
        for (User admin : admins) {
            notificationRepository.save(new Notification(admin, emergency, message, type));
        }
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getCurrentUserNotifications() {
        User current = authService.getCurrentUser();
        return notificationRepository.findByUserOrderByCreatedAtDesc(current)
                .stream()
                .map(NotificationDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount() {
        User current = authService.getCurrentUser();
        return notificationRepository.countByUserAndReadStatusFalse(current);
    }

    @Transactional
    public NotificationDto markAsRead(Long id) {
        User current = authService.getCurrentUser();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + id));

        if (!notification.getUser().getId().equals(current.getId())) {
            throw new UnauthorizedException("You do not have permission to modify this notification");
        }

        notification.setReadStatus(true);
        notification = notificationRepository.save(notification);
        return new NotificationDto(notification);
    }

    @Transactional
    public void markAllAsRead() {
        User current = authService.getCurrentUser();
        List<Notification> unread = notificationRepository.findByUserAndReadStatusFalseOrderByCreatedAtDesc(current);
        for (Notification n : unread) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(unread);
    }
}
