import { defineStore } from 'pinia'
import Brevo from '@brevo/web-sdk'

const brevoClient = new Brevo.ApiClient()
brevoClient.authentications['api-key'].apiKey = import.meta.env.VITE_BREVO_API_KEY

export const useNewsletterStore = defineStore('newsletter', {
  state: () => ({
    loading: false,
    error: null,
    success: false
  }),
  actions: {
    async subscribeToNewsletter(email) {
      this.loading = true
      this.error = null
      this.success = false

      try {
        const apiInstance = new Brevo.ContactsApi(brevoClient)
        const createContact = new Brevo.CreateContact()
        
        createContact.email = email
        createContact.listIds = [2] // Replace with your actual list ID
        
        await apiInstance.createContact(createContact)
        
        this.success = true
      } catch (error) {
        this.error = error.response?.text || 'An error occurred. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
})