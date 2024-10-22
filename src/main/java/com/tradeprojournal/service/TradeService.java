package com.tradeprojournal.service;

import com.tradeprojournal.model.Trade;
import com.tradeprojournal.repository.TradeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TradeService {

    @Autowired
    private TradeRepository tradeRepository;

    public List<Trade> getAllTradesByUserId(String userId) {
        return tradeRepository.findByUserId(userId);
    }

    public Trade saveTrade(Trade trade) {
        return tradeRepository.save(trade);
    }

    public void deleteTrade(String id) {
        tradeRepository.deleteById(id);
    }

    public Trade updateTrade(String id, Trade trade) {
        trade.setId(id);
        return tradeRepository.save(trade);
    }
}