package com.tradeprojournal.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "trades")
public class Trade {
    @Id
    private String id;
    private String userId;
    private LocalDate date;
    private String symbol;
    private String action;
    private int quantity;
    private double price;
    private String type;
    private String optionType;
    private String strategy;
    private String notes;
    private LocalDate exitDate;
    private Double exitPrice;
    private Double profit;
    private Double profitPercentage;
}