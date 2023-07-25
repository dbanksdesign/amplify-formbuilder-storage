import * as React from 'react';
import { Post } from '@/models';
import PostCreateForm from '@/ui-components/PostCreateForm';
import { DataStore, Predicates, SortDirection } from 'aws-amplify';
import {
  Alert,
  Card,
  Collection,
  Flex,
  Text,
  View,
} from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';

export default function Home() {
  const [items, setItems] = React.useState<Array<Post>>([]);
  const [alert, setAlert] = React.useState<string>();
  const ref = React.useRef<{ clearFiles: () => void }>(null);

  React.useEffect(() => {
    const sub = DataStore.observeQuery(Post, Predicates.ALL, {
      sort: (item) => item.createdAt(SortDirection.DESCENDING),
    }).subscribe((snapshot) => {
      const { items } = snapshot;
      setItems(items);
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <Flex direction="row" alignItems="flex-start" minHeight="100vh">
      <View flex="1" position="sticky" top="0" padding="large">
        <PostCreateForm
          overrides={{
            image: {
              ref,
            },
          }}
          onSuccess={() => {
            setAlert('Post saved!');
            ref?.current?.clearFiles();
            setTimeout(() => {
              setAlert(undefined);
            }, 2000);
          }}
        />
        {alert ? <Alert variation="success">{alert}</Alert> : null}
      </View>
      <View
        flex="1"
        alignSelf="stretch"
        backgroundColor="background.tertiary"
        padding="xl"
      >
        <Collection
          type="list"
          direction="column"
          justifyContent="left"
          items={items}
        >
          {(item, index) => (
            <Card variation="elevated" key={index}>
              <StorageImage
                accessLevel="public"
                imgKey={item.image ?? ''}
                alt=""
              />
              <Text>{item.body}</Text>
            </Card>
          )}
        </Collection>
      </View>
    </Flex>
  );
}
