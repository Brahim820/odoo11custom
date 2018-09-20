from odoo import api, fields, models, tools, _

class PosCategory(models.Model):
    _name = "pos.variants"

    name  = fields.Char(string="Variant Name", required=True, help="Name of the variant for selection")
    price  = fields.Float(string="Price")
