package com.corncrake.comms.items;

import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;

public class ItemBase extends SpecialItem{

    public ItemBase() {
        super(new Item.Properties().group(ItemGroup.MISC));
    }
}
