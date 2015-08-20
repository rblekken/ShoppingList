﻿using System;
using System.Collections.Generic;
using System.Linq;
using ShoppingList.Infrastructure.Interfaces;
using ShoppingList.Infrastructure.Models;
using ShoppingList.EFModel;
using ShoppingList.Repository.Mappers;
using ShoppingList = ShoppingList.EFModel.Entities.ShoppingList;

namespace ShoppingList.Repository.Repositories
{
    public class ShoppingListRepository : RepositoryBase<ShoppingListModel,EFModel.Entities.ShoppingList>, IShoppingListRepository
    {
        public ShoppingListRepository() : base(new ShoppingListMapper())
        {

        }

        public ShoppingListModel CreateEmptyList(int ownerUserId)
        {
            using (var context = new ShoppingListContext())
            {
                var owner = context.Users.Find(ownerUserId);
                var list = new EFModel.Entities.ShoppingList() {Owner = owner };
                context.ShoppingLists.Add(list);
                context.SaveChanges();
                return Map(list);
            }
        }

        public List<ShoppingListModel> GetByUserId(int userId)
        {
            using (var context = new ShoppingListContext())
            {
                var shoppinglists = context.ShoppingLists.Include("Items").ToList();
                var toModel = shoppinglists.Select(sl => Map(sl)).ToList();
                return toModel;
            }
        }
    }
}
