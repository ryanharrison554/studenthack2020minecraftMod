package com.corncrake.comms.items;

import com.corncrake.comms.InterserviceCommunication;
import com.corncrake.comms.util.KeyboardHelper;
import io.netty.channel.Channel;
import io.netty.handler.codec.http.*;
import net.minecraft.client.Minecraft;
import net.minecraft.client.util.ITooltipFlag;
import net.minecraft.entity.player.PlayerEntity;
import net.minecraft.item.Item;
import net.minecraft.item.ItemStack;
import net.minecraft.util.ActionResult;
import net.minecraft.util.Hand;
import net.minecraft.util.text.ITextComponent;
import net.minecraft.util.text.StringTextComponent;
import net.minecraft.world.World;
import org.apache.http.HttpStatus;

import javax.annotation.Nullable;
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
            URL url = new URL("https://discordapp.com/");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Language", "en-US");
            conn.setUseCaches(false);
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
            StringBuilder response = new StringBuilder(); // or StringBuffer if Java version 5+
            String line;
            while ((line = rd.readLine()) != null) {
                response.append(line);
                response.append('\r');
            }
            rd.close();
            //Minecraft.getInstance().player.sendChatMessage(response.toString());
            InterserviceCommunication.LOGGER.info(response.toString());


        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return super.onItemRightClick(worldIn, playerIn, handIn);
    }
}
