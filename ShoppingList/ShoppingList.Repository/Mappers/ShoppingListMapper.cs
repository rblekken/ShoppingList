﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using ShoppingList.Infrastructure.Models;

namespace ShoppingList.Repository.Mappers
{
    public class ShoppingListMapper : IMapper<ShoppingListModel, EFModel.Entities.ShoppingList>
    {
        public ShoppingListModel Map(EFModel.Entities.ShoppingList efShoppingList)
        {
            var model = new ShoppingListModel
            {
                Id = efShoppingList.Id,
                Name = efShoppingList.Name  
            };
            var itemMapper = new ShoppingItemMapper();

            foreach (var shoppingItem in efShoppingList.Items)
            {
                model.ShoppingItems.Add(itemMapper.Map(shoppingItem));
            }
            return model;
        }
    }
}
