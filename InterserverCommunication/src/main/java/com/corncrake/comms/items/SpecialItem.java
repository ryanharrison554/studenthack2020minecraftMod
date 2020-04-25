package com.corncrake.comms.items;

import com.corncrake.comms.InterserviceCommunication;
import com.corncrake.comms.util.KeyboardHelper;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.*;
import io.netty.handler.codec.http2.Http2Connection;
import io.netty.handler.codec.http2.Http2Settings;
import io.netty.handler.codec.http2.HttpToHttp2ConnectionHandler;
import net.minecraft.client.Minecraft;
import net.minecraft.client.util.ITooltipFlag;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.network.*;
import net.minecraft.server.MinecraftServer;
import net.minecraft.util.ActionResult;
import net.minecraft.util.Hand;
import net.minecraft.util.text.ITextComponent;
import net.minecraft.util.text.StringTextComponent;
import net.minecraft.world.World;
import org.apache.http.HttpStatus;

import javax.annotation.Nullable;
import javax.net.ssl.HttpsURLConnection;
import java.io.*;
import java.net.*;
import java.util.List;

public class SpecialItem extends Item
{
    public SpecialItem(Properties properties)
    {
        super(properties);
    }

    @Override
    public boolean hasEffect(ItemStack stack)
    {
        return true;
    }

    @Override
    public void addInformation(ItemStack stack, @Nullable World worldIn, List<ITextComponent> tooltip, ITooltipFlag flagIn)
    {
        if(KeyboardHelper.isHoldingShift())
        {
            tooltip.add(new StringTextComponent("Test info"));
        }
        else
        {
            tooltip.add(new StringTextComponent("Hold SHIFT for more information"));
        }
        super.addInformation(stack, worldIn, tooltip, flagIn);
    }

    @Override
    public ActionResult<ItemStack> onItemRightClick(World worldIn, PlayerEntity playerIn, Hand handIn)
    {
        try {
            // Connect to the specified url
            URL url = new URL("https://discordapp.com/api/users/142662858214342656");
            HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; en-US; rv:1.9.2.2) Gecko/20100316 Firefox/3.6.2");
            conn.setRequestProperty("Accept", "text/html,text/css,application/xhtml+xml,application/xml");
            conn.setRequestProperty("Accept-Language", "en-US,en-GB,en");
            conn.setRequestProperty("Authorization", "Bot NzAzNjA3MjI1OTk3ODUyNjkz.XqTHxg.aWgmzYx5Y6vm8jHH5WjNMf7Pz1U");
            conn.setUseCaches(false);
            conn.setDoInput(true);
            conn.setDoOutput(true);
            conn.connect();
            // Get the response
            if(conn.getResponseCode() == 200)
            {
                Minecraft.getInstance().player.sendChatMessage("Connection established.");
            }
            // Get the ack in the game
            InputStream is = conn.getInputStream();
            BufferedReader rd = new BufferedReader(new InputStreamReader(is));
            StringBuilder response = new StringBuilder();
            String line;
            while ((line = rd.readLine()) != null) {
                response.append(line);
                response.append('\r');
            }
            rd.close();
            // Output the http header if there is one
            InterserviceCommunication.LOGGER.debug(response.toString());

        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return super.onItemRightClick(worldIn, playerIn, handIn);
    }
}
