'use strict'

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const PakatApiV3Sdk = require('pakat-api-v3-sdk')
const defaultClient = PakatApiV3Sdk.ApiClient.instance

const getOptions = function (config, options) {
	// The below check is more accurate then the loadash version for what
	// we need. So we can get rid of lodash which is vulnerable about
	// every second week...
	options = typeof options == 'object' ? options : {}
	options.from = config.pakat_default_from || options.from
	options.fromName = config.pakat_default_from_name || options.fromName
	options.replyTo = config.pakat_default_replyto || options.replyTo
	options.text = options.text || options.html
	options.html = options.html || options.text
	return options
}

/* eslint-disable no-unused-vars */
module.exports = {
	provider: 'pakat',
	name: 'Pakat',
	auth: {
		pakat_default_from_name: {
			label: 'Pakat Default From Name',
			type: 'text',
		},
		pakat_default_from: {
			label: 'Pakat Default From Email',
			type: 'text',
		},
		pakat_default_replyto: {
			label: 'Pakat Default Reply-To Email',
			type: 'text',
		},
		pakat_api_key: {
			label: 'Pakat API Key',
			type: 'text',
		},
	},

	init: (config) => {
		const apiKey = defaultClient.authentications['api-key']
		apiKey.apiKey = config.pakat_api_key
		const apiInstance = new PakatApiV3Sdk.SMTPApi()
		const sendSmtpEmail = new PakatApiV3Sdk.SendSmtpEmail()

		return {
			send: (options, cb) => {
				return new Promise((resolve, reject) => {
					options = getOptions(config, options)
					sendSmtpEmail.sender = { email: options.from, name: options.fromName }
					sendSmtpEmail.replyTo = { email: options.replyTo }
					sendSmtpEmail.to = [{ email: options.to }]
					sendSmtpEmail.subject = options.subject
					sendSmtpEmail.htmlContent = options.html
					sendSmtpEmail.textContent = options.text

					apiInstance.sendTransacEmail(sendSmtpEmail).then(
						(data) => {
							resolve()
						},
						(error) => {
							reject(error)
						}
					)
				})
			},
		}
	},
}
