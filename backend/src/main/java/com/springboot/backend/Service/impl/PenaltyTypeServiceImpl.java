package com.springboot.backend.Service.impl;

import com.springboot.backend.Model.PenaltyType;
import com.springboot.backend.Repository.PenaltyTypeRepository;
import com.springboot.backend.Service.PenaltyTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class PenaltyTypeServiceImpl implements PenaltyTypeService {
    @Autowired
    private final PenaltyTypeRepository penaltyTypeRepository;
    @Override
    public List<PenaltyType> getAll() {
        return penaltyTypeRepository.findAll();
    }
}
