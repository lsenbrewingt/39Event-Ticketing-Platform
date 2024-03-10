const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的JSON数据
app.use(bodyParser.json());

// 模拟用户数据存储
let users = [
  { id: 1, username: 'john_doe', password: 'password123', events: [] },
  // 添加更多用户数据...
];

// 处理获取用户创建的所有事件的请求
app.get('/events/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.json({ events: user.events });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 处理创建新事件的请求
app.post('/events/:userId/create', (req, res) => {
  const userId = parseInt(req.params.userId);
  const { eventName, date, venue, ticketPrice, capacity } = req.body;

  const user = users.find((u) => u.id === userId);

  if (user) {
    const newEvent = { id: user.events.length + 1, eventName, date, venue, ticketPrice, capacity, ticketsSold: 0 };
    user.events.push(newEvent);
    res.json({ message: 'Event created successfully', event: newEvent });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 处理售票的请求
app.post('/events/:eventId/sell-tickets', (req, res) => {
  const eventId = parseInt(req.params.eventId);
  const { quantity } = req.body;

  const event = users.flatMap(u => u.events).find((e) => e.id === eventId);

  if (event) {
    if (event.ticketsSold + quantity <= event.capacity) {
      event.ticketsSold += quantity;
      res.json({ message: 'Tickets sold successfully', event });
    } else {
      res.status(400).json({ message: 'Not enough available tickets' });
    }
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
});

// 启动Express应用程序
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
