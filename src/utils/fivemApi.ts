// FiveM API utility functions for phone integration

export interface FiveMResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class FiveMAPI {
  private baseUrl = 'http://localhost:30120';
  
  async request<T = any>(endpoint: string, data: any): Promise<FiveMResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error(`FiveM API Error (${endpoint}):`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Phone API methods
  async getContacts(source: string) {
    return this.request('/phone/contacts', { source, action: 'get_contacts' });
  }

  async addContact(source: string, name: string, number: string) {
    return this.request('/phone/contacts', { 
      source, 
      action: 'add_contact', 
      name, 
      number 
    });
  }

  async makeCall(source: string, target: string) {
    return this.request('/phone/call', { 
      source, 
      target, 
      action: 'start_call' 
    });
  }

  async sendMessage(source: string, recipient: string, message: string) {
    return this.request('/phone/messages', { 
      source, 
      action: 'send_message', 
      recipient, 
      message 
    });
  }

  async getMessages(source: string, contact?: string) {
    return this.request('/phone/messages', { 
      source, 
      action: contact ? 'get_messages' : 'get_conversations',
      contact 
    });
  }

  async takePhoto(source: string, flash: string) {
    return this.request('/phone/camera', { 
      source, 
      action: 'take_photo', 
      flash 
    });
  }

  async startRecording(source: string) {
    return this.request('/phone/camera', { 
      source, 
      action: 'start_recording' 
    });
  }

  async stopRecording(source: string) {
    return this.request('/phone/camera', { 
      source, 
      action: 'stop_recording' 
    });
  }

  async getEmails(source: string) {
    return this.request('/phone/mail', { 
      source, 
      action: 'get_emails' 
    });
  }

  async sendEmail(source: string, to: string, subject: string, body: string) {
    return this.request('/phone/mail', { 
      source, 
      action: 'send_email', 
      to, 
      subject, 
      body 
    });
  }

  async updateSetting(source: string, setting: string, value: boolean | number) {
    return this.request('/phone/settings', { 
      source, 
      action: 'update_setting', 
      setting, 
      value 
    });
  }

  async getSettings(source: string) {
    return this.request('/phone/settings', { 
      source, 
      action: 'get_settings' 
    });
  }
}

export const fivemApi = new FiveMAPI();