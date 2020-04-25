package com.corncrake.comms.blocks;

import net.minecraft.block.Block;
import net.minecraft.block.SoundType;
import net.minecraft.block.material.Material;

public class BlockBase extends Block {

    public BlockBase() {
        super(Block.Properties.create(Material.IRON)
                              .hardnessAndResistance(1.5f, 15.0f)
                              .sound(SoundType.METAL));

    }
}
