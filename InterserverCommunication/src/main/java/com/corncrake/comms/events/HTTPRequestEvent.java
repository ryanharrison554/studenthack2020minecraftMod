package com.corncrake.comms.events;

import com.corncrake.comms.InterserviceCommunication;
import io.netty.handler.codec.http.HttpRequest;
import net.minecraftforge.api.distmarker.Dist;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

@Mod.EventBusSubscriber(modid = "InterserviceCommunication.MOD_ID", bus = Mod.EventBusSubscriber.Bus.FORGE)
public class HTTPRequestEvent
{
    @SubscribeEvent
    public static void HTTPRequestEvent(HttpRequest event)
    {
        //InterserviceCommunication.LOGGER.info("HTTPRequestEvent fired");
        //HttpRequest request = event.
        //World world =
    }
}
