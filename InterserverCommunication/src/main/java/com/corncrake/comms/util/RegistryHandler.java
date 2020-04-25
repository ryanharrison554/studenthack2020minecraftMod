package com.corncrake.comms.util;

import com.corncrake.comms.InterserviceCommunication;
import com.corncrake.comms.blocks.BlockBase;
import com.corncrake.comms.blocks.BlockItemBase;
import com.corncrake.comms.items.ItemBase;
import net.minecraft.block.Block;
import net.minecraft.item.BlockItem;
import net.minecraft.item.Item;
import net.minecraftforge.fml.RegistryObject;
import net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext;
import net.minecraftforge.registries.DeferredRegister;
import net.minecraftforge.registries.ForgeRegistries;

public class RegistryHandler {

    public static final DeferredRegister<Item> ITEMS = new DeferredRegister<>(ForgeRegistries.ITEMS, InterserviceCommunication.MOD_ID);
    public static final DeferredRegister<Block> BLOCKS = new DeferredRegister<>(ForgeRegistries.BLOCKS, InterserviceCommunication.MOD_ID);

    // For items
    public static final RegistryObject<Item> RUBY = ITEMS.register("ruby", ItemBase::new);
    // For blocks
    public static final RegistryObject<BlockItem> COMMUNICATOR_BLOCK_ITEM = ITEMS.register("communicator_block", BlockItemBase::new);
    public static final RegistryObject<Block> COMMUNICATOR_BLOCK = BLOCKS.register("communicator_block", BlockBase::new);



    public static void init() {
        ITEMS.register(FMLJavaModLoadingContext.get().getModEventBus());
        BLOCKS.register(FMLJavaModLoadingContext.get().getModEventBus());


    }
}

