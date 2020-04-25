package com.corncrake.comms.blocks;

import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;

public class BlockItemBase extends BlockItem {
    public BlockItemBase() {
        super(new BlockBase(), new Item.Properties().group(ItemGroup.MISC));
    }
}
