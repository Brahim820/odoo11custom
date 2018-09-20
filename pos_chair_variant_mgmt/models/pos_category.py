from odoo import api, fields, models,exceptions

class PosCategory(models.Model):
    _inherit = "pos.category"

    variant_ids = fields.Many2many('pos.variants', string="Varients")
    default_popup_for_varient = fields.Boolean(string='Show Pop By Default', help="If checked pop will be shown when product is clicked")
    is_add_ons = fields.Boolean(string='Add-ons Product', help="If checked pop will be shown when product is clicked", )

    # @api.onchange('is_add_ons')
    # def abc(self):
    #     print('ghfh')

    # @api.multi
    # def search(self):
    #     for r in self:
    #         print(r)



    @api.model
    def create(self, vals):
        if 'is_add_ons' in vals and vals['is_add_ons']:
            if self.search([('is_add_ons', '=', True)], limit=1):
                raise exceptions.ValidationError("There can be only one category for Addon Products")
        return super(PosCategory, self).create(vals)
    @api.multi
    def write(self, vals):
        if 'is_add_ons' in vals and vals['is_add_ons']:
            self.ensure_one()
            if self.search([('is_add_ons', '=', True), ('id', 'not in', list(self._ids))], limit=1):
                raise exceptions.ValidationError("There can be only one category for Addon Products")
        if 'active' in vals and vals['active']:
            self.ensure_one()
            if self.search([('is_add_ons', '=', True)], limit=1):
                raise exceptions.ValidationError("There can be only one category for Addon Products")
        return super(PosCategory, self).write(vals)
