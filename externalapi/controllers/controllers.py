# -*- coding: utf-8 -*-
from odoo import http
import os
class Externalapi(http.Controller):
    @http.route('/externalapi/externalapi/', auth='public')
    def index(self, **kw):
        return "Hello, world"

    @http.route('/externalapi/externalapi/objects/', auth='public')
    def list(self, **kw):
        return http.request.render('externalapi.listing', {
            'root': '/externalapi/externalapi',
            'objects': http.request.env['externalapi.externalapi'].search([]),
        })

    @http.route('/externalapi/externalapi/react/', auth='public', website=True)
    # in above can use without website too
    def list(self, **kw):
        os.system('babel /home/lalit/odoo-11.0/customaddons/externalapi/static/src/js/source.js --out-file=/home/lalit/odoo-11.0/customaddons/externalapi/static/src/js/app.js --presets=env,react')
        return http.request.render('externalapi.react', {
            'root': '/externalapi/externalapi',
        })

    # @http.route('/externalapi/externalapi/objects/<model("externalapi.externalapi"):obj>/', auth='public')
    # def object(self, obj, **kw):
    #     return http.request.render('externalapi.object', {
    #         'object': obj
    #     })