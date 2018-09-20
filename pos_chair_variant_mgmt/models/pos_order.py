from odoo import api, fields, models



class Chair(models.Model):
    _inherit = "pos.order.line"


    chair=fields.Char(string="Chair", help="Chair for serving")
    seperator=fields.Boolean(string="Separator", help="Seperator")
    variant_ids=fields.Many2many('pos.variants', string='Variants', readonly=True)
