const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Helper to get authorization header
function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('upvc_admin_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Client request wrapper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMsg = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      errMsg = errorData.message || errMsg;
    } catch (e) {}
    throw new Error(errMsg);
  }

  // Handle file downloads
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument')) {
    return response as any;
  }

  return response.json();
}

// API methods
export const ApiService = {
  // --- Public Endpoints ---
  
  // Health Check
  async checkHealth() {
    return request<{ status: string; timestamp: string }>('/health');
  },

  // Get Pricing Configurations
  async getConfigs(): Promise<{ [key: string]: string }> {
    return request<{ [key: string]: string }>('/config');
  },

  // Submit General Inquiry
  async submitInquiry(data: { name: string; email: string; phone: string; message: string }) {
    return request<{ success: boolean; message: string; data: any }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Submit Smart Quotation
  async submitQuotation(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    productType: 'WINDOW' | 'DOOR';
    productStyle: string;
    width: number;
    height: number;
    quantity: number;
    glassType: string;
    frameColor: string;
    hardwareQuality: string;
  }) {
    return request<{ success: boolean; message: string; data: any }>('/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // --- Admin Auth Endpoints ---

  // Admin Login
  async login(username: string, password: string) {
    return request<{ message: string; token: string; user: { id: number; username: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Verify Admin Token
  async verifyToken() {
    return request<{ valid: boolean; user: { id: number; username: string } }>('/auth/verify');
  },

  // --- Secured Admin Dashboard Endpoints ---

  // Get All Inquiries
  async getInquiries(): Promise<any[]> {
    return request<any[]>('/inquiries');
  },

  // Update Inquiry Status
  async updateInquiryStatus(id: number, status: 'NEW' | 'CONTACTED' | 'CLOSED') {
    return request<any>(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete Inquiry
  async deleteInquiry(id: number) {
    return request<{ success: boolean; message: string }>(`/inquiries/${id}`, {
      method: 'DELETE',
    });
  },

  // Get All Quotations
  async getQuotations(): Promise<any[]> {
    return request<any[]>('/quotes');
  },

  // Update Quotation Status
  async updateQuotationStatus(id: number, status: 'NEW' | 'CONTACTED' | 'SENT' | 'CLOSED') {
    return request<any>(`/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete Quotation
  async deleteQuotation(id: number) {
    return request<{ success: boolean; message: string }>(`/quotes/${id}`, {
      method: 'DELETE',
    });
  },

  // Update Pricing Configurations
  async updateConfigs(configs: { [key: string]: string }) {
    return request<{ success: boolean; message: string }>('/config', {
      method: 'PUT',
      body: JSON.stringify(configs),
    });
  },

  // Export Leads to Excel (downloads file)
  async downloadExcelReport() {
    const token = localStorage.getItem('upvc_admin_token');
    const response = await fetch(`${API_BASE_URL}/quotes/export`, {
      headers: {
        'Authorization': `Bearer ${token || ''}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to download report');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uPVC_Leads_Report.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};
