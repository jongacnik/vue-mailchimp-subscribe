import jsonp from 'jsonp'
import queryString from 'query-string'

export default {
  props: {
    url: {
      required: true,
      type: String,
    },

    userId: {
      required: true,
      type: String,
    },

    listId: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      email: null,
      firstname: null,
      lastname: null,
      success: false,
      error: null,
      loading: false,
    }
  },

  computed: {
    data() {
      let data = {
        u: this.userId,
        id: this.listId,
        EMAIL: this.email,
      }
      if (this.firstname) {
        data.FNAME = this.firstname
      }
      if (this.lastname) {
        data.LNAME = this.lastname
      }
      return queryString.stringify(data)
    },
  },

  methods: {
    setEmail(value = '') {
      this.email = value.trim()
    },

    setFirst(value = '') {
      this.firstname = value.trim()
    },

    setLast(value = '') {
      this.lastname = value.trim()
    },

    subscribe() {
      if (this.email === null || this.loading) {
        return
      }

      this.success = false
      this.error = null
      this.loading = true

      const url = `${this.url}?${this.data}`

      jsonp(url, { param: 'c' }, this.onResponse)
    },

    onResponse(error, data) {
      this.loading = false

      if (error) {
        this.error = error
      }

      if (data && data.result === 'error') {
        this.error = this.formatErrorMessage(data.msg)
      }

      if (this.error) {
        this.$emit('error', this.error)
      } else {
        this.success = true
        this.email = null
        this.firstname = null
        this.lastname = null
        this.$emit('success')
      }
    },

    formatErrorMessage(message) {
      return message.replace('0 - ', '')
    },
  },

  render() {
    return this.$scopedSlots.default({
      subscribe: this.subscribe,
      setEmail: this.setEmail,
      setFirst: this.setFirst,
      setLast: this.setLast,
      error: this.error,
      success: this.success,
      loading: this.loading,
    })
  },
}