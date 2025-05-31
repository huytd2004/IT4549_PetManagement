package com.example.server.repository;

import com.example.server.model.ServiceInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceInfoRepo extends JpaRepository<ServiceInfo, Integer> {
    Optional<ServiceInfo> findByNameAndServiceType(String name, ServiceInfo.ServiceType serviceType);
}
