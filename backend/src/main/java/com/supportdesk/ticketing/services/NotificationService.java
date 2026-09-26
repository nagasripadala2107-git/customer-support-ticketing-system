package com.supportdesk.ticketing.services;

import com.supportdesk.ticketing.entities.Notification;
import com.supportdesk.ticketing.entities.Ticket;
import com.supportdesk.ticketing.entities.User;
import com.supportdesk.ticketing.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void sendNotification(User recipient, Ticket ticket, String title, String message) {
        if (recipient == null) return;
        Notification notification = Notification.builder()
                .recipientUser(recipient)
                .ticket(ticket)
                .title(title)
                .message(message)
                .isRead(false)
                .build();
        notificationRepository.save(notification);
    }
}
