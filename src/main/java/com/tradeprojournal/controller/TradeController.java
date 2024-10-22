package com.tradeprojournal.controller;

import com.tradeprojournal.model.Trade;
import com.tradeprojournal.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired
    private TradeService tradeService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Trade>> getAllTradesByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(tradeService.getAllTradesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<Trade> createTrade(@RequestBody Trade trade) {
        return ResponseEntity.ok(tradeService.saveTrade(trade));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trade> updateTrade(@PathVariable String id, @RequestBody Trade trade) {
        return ResponseEntity.ok(tradeService.updateTrade(id, trade));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrade(@PathVariable String id) {
        tradeService.deleteTrade(id);
        return ResponseEntity.ok().build();
    }
}