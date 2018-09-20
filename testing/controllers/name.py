# -*- coding: utf-8 -*-
import logging
import odoo
from odoo.addons.base.ir.ir_qweb import AssetsBundle
from odoo import http
from odoo.http import request
from odoo import SUPERUSER_ID
from datetime import datetime, timedelta
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT
import json
from werkzeug.utils import secure_filename
import datetime


# class MOBAPI(odoo.http.Controller):
# 	@http.route('/api/test', methods=['POST'], type='http', auth='public', website=True, csrf=False)
# 	def test(self, **post)
# 		print('hello')