import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import BackgroundService from 'react-native-background-actions';
import axios from 'axios';
const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
const veryIntensiveTask = async taskDataArguments => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  let i = 1;
  while (BackgroundService.isRunning()) {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/${i}`)
      .then(response => {
        console.log("");
        console.log(response.data.title);
        console.log("");
      });
    // .then(json => {
    //   console.log('');
    //   console.log('');
    //   console.log(json);
    //   console.log('');
    //   console.log('');
    // });
    i++;
    await sleep(delay);
  }
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 5000,
  },
};

const App = () => {
  const createChannel = async () => {
    const channelConfig = {
      id: 'channelId',
      name: 'Channel name',
      description: 'Channel description',
      enableVibration: false,
    };
    await VIForegroundService.getInstance().createNotificationChannel(
      channelConfig,
    );
  };

  useEffect(() => {
    createChannel();
  }, []);

  const startForegroundService = async () => {
    // setInterval(() => console.log('kalai'), 100), console.log('calg');
    const notificationConfig = {
      channelId: 'channelId',
      id: 3456,
      title: 'Title',
      text: 'Some text',
      icon: 'ic_icon',
      // button: 'Some text',
    };
    try {
      const result = await VIForegroundService.getInstance().startService(
        notificationConfig,
      );
      console.log(result, 'result');
      console.log('try');
    } catch (e) {
      console.log(e);
      console.error(e);
    }
  };

  const stopForegroundService = async () => {
    await VIForegroundService.getInstance().stopService();
  };

  const startBackgroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'New ExampleTask description',
    });
  };

  const stopBackgroundService = async () => {
    await BackgroundService.stop();
  };
  return (
    <View>
      <Text>App</Text>
      <Button
        title="start forground service"
        onPress={() => startForegroundService()}
      />
      <Button title="stop forground service" onPress={stopForegroundService} />
      <Button
        title="start background service"
        onPress={startBackgroundService}
      />
      <Button title="stopBackgroundService" onPress={stopBackgroundService} />
    </View>
  );
};

export default App;
