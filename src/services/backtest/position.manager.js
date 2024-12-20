import { CONFIG } from '../../config.js';

class PositionManager {
    constructor() {
        this.reset();
    }

    reset() {
        this.positions = [];
        this.closedTrades = [];
        this.balance = CONFIG.TRADING.POSITION_SIZE;
    }

    canOpenPosition() {
        return this.positions.length < CONFIG.TRADING.MAX_POSITIONS;
    }

    openPosition(direction, price, timestamp) {
        const position = {
            direction,
            entryPrice: price,
            quantity: CONFIG.TRADING.POSITION_SIZE / price,
            stopLoss: this.calculateStopLoss(direction, price),
            takeProfit: this.calculateTakeProfit(direction, price),
            timestamp,
            trailingStop: null
        };

        this.positions.push(position);
    }

    updatePositions(currentPrice) {
        for (let i = this.positions.length - 1; i >= 0; i--) {
            const position = this.positions[i];
            const pnl = this.calculatePnL(position, currentPrice);

            // Update trailing stop if enabled
            if (CONFIG.TRADING.TRAILING_STOP.ENABLED) {
                this.updateTrailingStop(position, currentPrice, pnl);
            }

            // Check if position should be closed
            if (this.shouldClosePosition(position, currentPrice)) {
                this.closePosition(i, currentPrice);
            }
        }
    }

    calculateStopLoss(direction, price) {
        return direction === 'LONG' ?
            price * (1 - CONFIG.TRADING.STOP_LOSS_PERCENTAGE / 100) :
            price * (1 + CONFIG.TRADING.STOP_LOSS_PERCENTAGE / 100);
    }

    calculateTakeProfit(direction, price) {
        return direction === 'LONG' ?
            price * (1 + CONFIG.TRADING.TAKE_PROFIT_PERCENTAGE / 100) :
            price * (1 - CONFIG.TRADING.TAKE_PROFIT_PERCENTAGE / 100);
    }

    calculatePnL(position, currentPrice) {
        const { direction, entryPrice, quantity } = position;
        return direction === 'LONG' ?
            (currentPrice - entryPrice) * quantity :
            (entryPrice - currentPrice) * quantity;
    }

    updateTrailingStop(position, currentPrice, pnl) {
        const activationThreshold = position.entryPrice * 
            (CONFIG.TRADING.TRAILING_STOP.ACTIVATION_PERCENTAGE / 100);

        if (pnl > activationThreshold) {
            const newStop = this.calculateTrailingStop(position.direction, currentPrice);
            
            if (!position.trailingStop || 
                (position.direction === 'LONG' && newStop > position.trailingStop) ||
                (position.direction === 'SHORT' && newStop < position.trailingStop)) {
                position.trailingStop = newStop;
            }
        }
    }

    calculateTrailingStop(direction, currentPrice) {
        return direction === 'LONG' ?
            currentPrice * (1 - CONFIG.TRADING.TRAILING_STOP.TRAILING_PERCENTAGE / 100) :
            currentPrice * (1 + CONFIG.TRADING.TRAILING_STOP.TRAILING_PERCENTAGE / 100);
    }

    shouldClosePosition(position, currentPrice) {
        const { direction, stopLoss, takeProfit, trailingStop } = position;
        
        if (direction === 'LONG') {
            if (currentPrice <= stopLoss) return true;
            if (currentPrice >= takeProfit) return true;
            if (trailingStop && currentPrice <= trailingStop) return true;
        } else {
            if (currentPrice >= stopLoss) return true;
            if (currentPrice <= takeProfit) return true;
            if (trailingStop && currentPrice >= trailingStop) return true;
        }
        
        return false;
    }

    closePosition(index, currentPrice) {
        const position = this.positions[index];
        const pnl = this.calculatePnL(position, currentPrice);
        const fees = this.calculateFees(position, currentPrice);
        const netPnl = pnl - fees;
        
        this.balance += netPnl;
        this.closedTrades.push({
            ...position,
            exitPrice: currentPrice,
            pnl: netPnl,
            fees
        });
        
        this.positions.splice(index, 1);
    }

    calculateFees(position, currentPrice) {
        return (currentPrice * position.quantity) * 
            (CONFIG.TRADING.COMMISSION_RATE / 100);
    }

    getBalance() {
        return this.balance;
    }

    getClosedTrades() {
        return this.closedTrades;
    }
}

export const positionManager = new PositionManager();