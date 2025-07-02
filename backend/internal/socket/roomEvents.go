package socket

import "github.com/Roshan-anand/code-join/internal/utils"

type room struct {
	id   string
	clients   map[string]*Client
}
//       const { containerID } = await createContainer(lang, socket);
//       //if container is not created then emit error
//       if (!containerID) {
//         socket.emit("error", "Error while creating the environment");
//         return;
//       }

//       runNonInteractiveCmd(socket, roomID, true);
//       createNewStream(socket, roomID);

func (c *Client) createRoom(d *WsData[string]) {
	name := (*d)["name"]
	email := (*d)["email"]
	lang := (*d)["lang"]

	c.name = name
	c.email = email

	//create a new studio
	id := utils.GenerateID(8)
	c.hub.mu.Lock()
	room:= &room{
		id:      id,
		clients:   make(map[string]*Client),
	}
	room.clients[email] = c
	c.hub.studios[id] = room
	c.room = room
	c.hub.mu.Unlock()


	rData := &RwsEv{
		Event: "room:created",
		Data: map[string]interface{}{
			"roomID": id,
		},
	}

	c.WsEmit(rData)
}
//   //event to join a room
//   socket.on("join-room", ({ roomID, name, profile }) => {
//     if (rooms.has(roomID)) {
//       rooms
//         .get(roomID)!
//         .members.set(socket.id, { name, profile, currFile: null });
//       socket.join(roomID);
//       socket.emit("room-joined", roomID);

//       runNonInteractiveCmd(socket, roomID, true);
//     } else {
//       socket.emit("error", "Room does not exist");
//     }
//   });
// to create a new room


// to join an existing room
func (c *Client) joinRoom(d *WsData[string]) {
	roomID := (*d)["roomID"]
	name := (*d)["name"]
	email := (*d)["email"]

	c.name = name
	c.email = email

	rData := &RwsEv{
		Data: make(WsData[any]),
	}

	c.hub.mu.Lock()
	studio, exists := c.hub.studios[roomID]
	if !exists {
		c.hub.mu.Unlock()
		rData.Event = "error"
		c.WsEmit(rData)
		return
	}

	studio.clients[email] = c
	c.studio = studio
	c.hub.mu.Unlock()

	rData.Event = "room:joined"
	rData.Data["roomID"] = roomID
	c.WsEmit(rData)
}

// to check the existence of a room
func (c *Client) checkRoom(d *WsData[string]) {
	roomID := (*d)["roomID"]
	studioID := (*d)["studioID"]

	rData := &RwsEv{
		Event: "room:checked",
		Data:  make(WsData[any]),
	}

	c.hub.mu.Lock()
	studio, exists := c.hub.studios[roomID]
	if !exists || studio.name != studioID {
		rData.Data["exist"] = false
		c.hub.mu.Unlock()
		c.WsEmit(rData)
		return
	}
	c.hub.mu.Unlock()

	rData.Data["exist"] = true
	c.WsEmit(rData)
}
