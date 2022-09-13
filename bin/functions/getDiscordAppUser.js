import { Client } from "discord-rpc";
export let user;
export default function getDiscordAppUser() {
    return new Promise(async (res, rej) => {
        if (user)
            return user;
        const client = new Client({ transport: "ipc" });
        const t = setTimeout(() => {
            if (user)
                return;
            client.destroy();
            res(undefined);
        }, 500);
        try {
            await client.login({ clientId: "503557087041683458" });
            clearTimeout(t);
            await client.destroy();
        }
        catch { }
        user = client.user;
        res(client.user);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0RGlzY29yZEFwcFVzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZnVuY3Rpb25zL2dldERpc2NvcmRBcHBVc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQVEsTUFBTSxhQUFhLENBQUM7QUFFM0MsTUFBTSxDQUFDLElBQUksSUFBc0IsQ0FBQztBQUVsQyxNQUFNLENBQUMsT0FBTyxVQUFVLGlCQUFpQjtJQUN4QyxPQUFPLElBQUksT0FBTyxDQUFtQixLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ3ZELElBQUksSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRXRCLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFaEQsTUFBTSxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUN6QixJQUFJLElBQUk7Z0JBQUUsT0FBTztZQUVqQixNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDakIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2hCLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVSLElBQUk7WUFDSCxNQUFNLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUN2QjtRQUFDLE1BQU0sR0FBRTtRQUVWLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBRW5CLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsQ0FBQyxDQUFDLENBQUM7QUFDSixDQUFDIn0=