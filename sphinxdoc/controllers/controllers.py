# -*- coding: utf-8 -*-
from odoo import http

# class Sphinxdoc(http.Controller):
#     @http.route('/sphinxdoc/sphinxdoc/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/sphinxdoc/sphinxdoc/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('sphinxdoc.listing', {
#             'root': '/sphinxdoc/sphinxdoc',
#             'objects': http.request.env['sphinxdoc.sphinxdoc'].search([]),
#         })

#     @http.route('/sphinxdoc/sphinxdoc/objects/<model("sphinxdoc.sphinxdoc"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('sphinxdoc.object', {
#             'object': obj
#         })