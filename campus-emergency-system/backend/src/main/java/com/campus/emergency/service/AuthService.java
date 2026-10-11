package com.campus.emergency.service;

import com.campus.emergency.dto.AuthResponse;
import com.campus.emergency.dto.LoginRequest;
import com.campus.emergency.dto.RegisterRequest;
import com.campus.emergency.dto.UserDto;
import com.campus.emergency.entity.User;
import com.campus.emergency.enums.Role;
import com.campus.emergency.exception.BadRequestException;
import com.campus.emergency.exception.ResourceNotFoundException;
import com.campus.emergency.repository.UserRepository;
import com.campus.emergency.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists");
        }

        // Security rule: Public registration ONLY allows STUDENT or FACULTY
        Role role = request.getRole();
        if (role == null || (role != Role.STUDENT && role != Role.FACULTY)) {
            role = Role.STUDENT;
        }

        User user = new User(
                request.getFullName(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getPhone(),
                role,
                request.getDepartment()
        );

        user = userRepository.save(user);

        String token = tokenProvider.generateTokenFromUser(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );

        return new AuthResponse(token, new UserDto(user));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isActive()) {
            throw new BadRequestException("Account has been deactivated. Please contact the campus security administrator.");
        }

        return new AuthResponse(token, new UserDto(user));
    }

    @Transactional(readOnly = true)
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResourceNotFoundException("No authenticated user in current context");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUserDto() {
        return new UserDto(getCurrentUser());
    }

    @Transactional
    public UserDto updateProfile(String fullName, String phone, String department) {
        User user = getCurrentUser();
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName.trim());
        }
        if (phone != null) {
            user.setPhone(phone.trim());
        }
        if (department != null) {
            user.setDepartment(department.trim());
        }
        user = userRepository.save(user);
        return new UserDto(user);
    }
}
