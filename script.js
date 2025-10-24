// NYC Parking Violation Checker JavaScript

class NYCViolationChecker {
    constructor() {
        this.apiUrl = 'https://data.cityofnewyork.us/resource/nc67-uf89.json';
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupFormValidation();
    }

    bindEvents() {
        const form = document.getElementById('search-form');
        const plateInput = document.getElementById('plate-input');

        form.addEventListener('submit', (e) => this.handleSearch(e));
        plateInput.addEventListener('input', (e) => this.formatPlateInput(e));
    }

    setupFormValidation() {
        const plateInput = document.getElementById('plate-input');
        plateInput.addEventListener('keypress', (e) => {
            // Allow only alphanumeric characters
            const char = String.fromCharCode(e.which);
            if (!/[a-zA-Z0-9]/.test(char)) {
                e.preventDefault();
            }
        });
    }

    formatPlateInput(e) {
        // Convert to uppercase for consistency
        e.target.value = e.target.value.toUpperCase();
    }

    async handleSearch(e) {
        e.preventDefault();
        
        const plateInput = document.getElementById('plate-input');
        const stateSelect = document.getElementById('state-select');
        const plate = plateInput.value.trim();
        const state = stateSelect.value;

        if (!plate) {
            this.showError('Please enter a license plate number.');
            return;
        }

        if (plate.length < 2) {
            this.showError('License plate must be at least 2 characters long.');
            return;
        }

        this.showLoading();
        this.setSearchButtonState(true);

        try {
            const violations = await this.searchViolations(plate, state);
            
            if (violations.length === 0) {
                this.showNoResults();
            } else {
                this.showResults(violations, plate, state);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Unable to search for violations. Please try again later.');
        } finally {
            this.setSearchButtonState(false);
        }
    }

    async searchViolations(plate, state) {
        try {
            // Construct the API query
            let query = `?plate=${encodeURIComponent(plate)}`;
            
            // Add state filter if not 'other'
            if (state !== 'other') {
                query += `&state=${encodeURIComponent(state)}`;
            }

            // Limit results for performance
            query += '&$limit=100';

            const response = await fetch(this.apiUrl + query);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.processViolationData(data);

        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    }

    processViolationData(rawData) {
        return rawData.map(violation => ({
            summons_number: violation.summons_number || 'N/A',
            plate: violation.plate || 'N/A',
            state: violation.state || 'N/A',
            license_type: violation.license_type || 'N/A',
            issue_date: violation.issue_date || 'N/A',
            violation_time: violation.violation_time || 'N/A',
            violation: violation.violation || 'N/A',
            fine_amount: violation.fine_amount || '0',
            penalty_amount: violation.penalty_amount || '0',
            interest_amount: violation.interest_amount || '0',
            reduction_amount: violation.reduction_amount || '0',
            payment_amount: violation.payment_amount || '0',
            amount_due: violation.amount_due || '0',
            precinct: violation.precinct || 'N/A',
            county: violation.county || 'N/A',
            issuing_agency: violation.issuing_agency || 'N/A',
            violation_status: violation.violation_status || 'N/A',
            judgment_entry_date: violation.judgment_entry_date || null
        }));
    }

    showLoading() {
        this.hideAllStates();
        document.getElementById('loading-spinner').style.display = 'block';
    }

    showError(message) {
        this.hideAllStates();
        const errorDiv = document.getElementById('error-message');
        const errorText = document.getElementById('error-text');
        errorText.textContent = message;
        errorDiv.style.display = 'block';
    }

    showNoResults() {
        this.hideAllStates();
        document.getElementById('no-results').style.display = 'block';
    }

    showResults(violations, plate, state) {
        this.hideAllStates();
        
        const resultsDiv = document.getElementById('results');
        const countDiv = document.getElementById('results-count');
        const listDiv = document.getElementById('violations-list');

        // Update count
        const count = violations.length;
        countDiv.textContent = `${count} violation${count !== 1 ? 's' : ''} found`;

        // Clear previous results
        listDiv.innerHTML = '';

        // Create violation cards
        violations.forEach(violation => {
            const card = this.createViolationCard(violation);
            listDiv.appendChild(card);
        });

        resultsDiv.style.display = 'block';
    }

    createViolationCard(violation) {
        const card = document.createElement('div');
        card.className = 'violation-card';

        const amountDue = parseFloat(violation.amount_due) || 0;
        const fineAmount = parseFloat(violation.fine_amount) || 0;
        const penaltyAmount = parseFloat(violation.penalty_amount) || 0;
        const totalAmount = fineAmount + penaltyAmount;

        const isPaid = amountDue === 0;
        const statusClass = isPaid ? 'status-paid' : 'status-due';
        const statusText = isPaid ? 'PAID' : `$${amountDue.toFixed(2)} DUE`;

        card.innerHTML = `
            <div class="violation-header">
                <div>
                    <div class="violation-type">${this.formatViolationType(violation.violation)}</div>
                    <div class="violation-date">${this.formatDate(violation.issue_date)} at ${violation.violation_time}</div>
                </div>
                <div class="fine-amount ${statusClass}">
                    ${statusText}
                </div>
            </div>
            
            <div class="violation-details">
                <div class="detail-item">
                    <span class="detail-label">Summons Number</span>
                    <span class="detail-value">${violation.summons_number}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">License Plate</span>
                    <span class="detail-value">${violation.plate} (${violation.state})</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Fine Amount</span>
                    <span class="detail-value">$${fineAmount.toFixed(2)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Penalty</span>
                    <span class="detail-value">$${penaltyAmount.toFixed(2)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">Precinct ${violation.precinct}, ${this.getCountyName(violation.county)}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Issuing Agency</span>
                    <span class="detail-value">${this.formatAgency(violation.issuing_agency)}</span>
                </div>
                
                ${violation.violation_status !== 'N/A' ? `
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">${this.formatStatus(violation.violation_status)}</span>
                </div>
                ` : ''}
                
                ${violation.judgment_entry_date ? `
                <div class="detail-item">
                    <span class="detail-label">Judgment Date</span>
                    <span class="detail-value">${this.formatDate(violation.judgment_entry_date)}</span>
                </div>
                ` : ''}
            </div>
        `;

        return card;
    }

    formatViolationType(violation) {
        if (!violation || violation === 'N/A') return 'Parking Violation';
        
        // Capitalize and format violation type
        return violation
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    formatDate(dateString) {
        if (!dateString || dateString === 'N/A') return 'N/A';
        
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    formatAgency(agency) {
        if (!agency || agency === 'N/A') return 'N/A';
        
        const agencyMap = {
            'TRAFFIC': 'NYPD Traffic',
            'POLICE': 'NYPD',
            'DEPARTMENT OF SANITATION': 'DSNY',
            'DEPARTMENT OF TRANSPORTATION': 'DOT',
            'FIRE DEPARTMENT': 'FDNY'
        };

        return agencyMap[agency] || agency;
    }

    formatStatus(status) {
        if (!status || status === 'N/A') return 'N/A';
        
        // Clean up status text
        return status
            .toLowerCase()
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' - ');
    }

    getCountyName(countyCode) {
        const countyMap = {
            'NY': 'Manhattan',
            'BX': 'Bronx',
            'K': 'Brooklyn',
            'Q': 'Queens',
            'R': 'Staten Island',
            'MN': 'Manhattan',
            'BK': 'Brooklyn',
            'QN': 'Queens',
            'ST': 'Staten Island'
        };

        return countyMap[countyCode] || countyCode || 'N/A';
    }

    hideAllStates() {
        document.getElementById('loading-spinner').style.display = 'none';
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('no-results').style.display = 'none';
        document.getElementById('results').style.display = 'none';
    }

    setSearchButtonState(disabled) {
        const button = document.getElementById('search-btn');
        const originalText = '<i class="fas fa-search"></i> Search Violations';
        const loadingText = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        
        button.disabled = disabled;
        button.innerHTML = disabled ? loadingText : originalText;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NYCViolationChecker();
});

// Add some utility functions for better UX
document.addEventListener('DOMContentLoaded', () => {
    // Auto-focus on the input field
    const plateInput = document.getElementById('plate-input');
    if (plateInput) {
        plateInput.focus();
    }
    
    // Add keyboard shortcut (Enter) for search
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.id !== 'plate-input') {
            const form = document.getElementById('search-form');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    });
});