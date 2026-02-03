// import imagePath from "@/constant/imagePath";
// import chatBotStyle from '@/theme/chatBotStyle';
// import globalFonts from "@/theme/fontFamily";
// import globalStyle from '@/theme/globalStyle';
// import themeColors from '@/theme/themeColors';
// import { Image, Text, View } from 'react-native';
// import * as Animatable from 'react-native-animatable';

// const MessageBubble = ({ msg }) => {
//   const isBot = msg.sender === 'bot';
//   const isPdf = (fileName) => {
//     return /\.pdf$/i.test(fileName);
//   }
//   return (
//     <Animatable.View
//       // key={index}
//       animation="fadeIn"
//       style={[
//         chatBotStyle.messageContainer,
//         isBot ? chatBotStyle.MessageLeft : chatBotStyle.MessageRight,
//       ]}
//     >
//       {isBot && <Image source={require('@/assets/images/bot.png')} style={chatBotStyle.chatImage} resizeMode="contain" />}
//       <View>
//         {!!msg.image ? (
//           <Image source={isPdf(msg.image) ? imagePath.pdf : { uri: msg.image }} style={chatBotStyle.sendImage} />
//         ) : (
//           <View style={[
//             chatBotStyle.messageBx,
//             isBot ? chatBotStyle.borderRadiusLB : chatBotStyle.borderRadiusRB,
//             { backgroundColor: isBot ? msg.color : themeColors.darkCharcoal }
//           ]}>
//             {!!msg.header && (
//               <Text style={[
//                 chatBotStyle.messageHeading,
//                 globalStyle.commonHeading,
//                 globalFonts.poppins_500,
//                 { color: msg.color === "#ffc107" ? themeColors.black : themeColors.white }
//               ]}>
//                 {msg.header}
//               </Text>
//             )}
//             {!!msg.content && (
//               <Text style={[
//                 chatBotStyle.messageText,
//                 globalStyle.commonText,
//                 globalFonts.poppins_500,
//                 { color: msg.color === "#ffc107" ? themeColors.black : themeColors.lightGray }
//               ]}>
//                 {msg.content}
//               </Text>
//             )}
//           </View>
//         )}
//         <Text style={[chatBotStyle.timeText, globalFonts.poppins_500, globalStyle.commonText, msg.sender === 'user' && chatBotStyle.textAlignR,
//         { color: isBot ? msg.color : themeColors.darkCharcoal }
//         ]}>
//           {msg.time}
//         </Text>
//       </View>
//       {msg.sender === 'user' && <Image source={require('@/assets/images/user.png')} style={chatBotStyle.chatImage} resizeMode="contain" />}
//     </Animatable.View>
//   );
// };

// export default MessageBubble;



import imagePath from "@/constant/imagePath";
import chatBotStyle from '@/theme/chatBotStyle';
import globalFonts from "@/theme/fontFamily";
import globalStyle from '@/theme/globalStyle';
import themeColors from '@/theme/themeColors';
import { Image, Text, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const MessageBubble = ({ msg }) => {
  const isBot = msg.sender === 'bot';

  const isPdf = (fileName = '') => /\.pdf$/i.test(fileName);

  const isImageArray = Array.isArray(msg.image);

  const renderSingleImage = (img) => (
    <Image
      source={isPdf(img) ? imagePath.pdf : { uri: img }}
      style={chatBotStyle.sendImage}
      resizeMode="cover"
    />
  );

  const renderImageGrid = (images) => {
    return (
      <View style={chatBotStyle.imageGrid}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={isPdf(img) ? imagePath.pdf : { uri: img }}
            style={chatBotStyle.gridImage}
            resizeMode="cover"
          />
        ))}
      </View>
    )
  };

  return (
    <Animatable.View
      animation="fadeIn"
      style={[
        chatBotStyle.messageContainer,
        isBot ? chatBotStyle.MessageLeft : chatBotStyle.MessageRight,
      ]}
    >
      {isBot && (
        <Image
          source={require('@/assets/images/bot.png')}
          style={chatBotStyle.chatImage}
          resizeMode="contain"
        />
      )}

      <View>
        {!!msg.image ? (
          isImageArray
            ? renderImageGrid(msg.image)
            : renderSingleImage(msg.image)
        ) : (
          <View
            style={[
              chatBotStyle.messageBx,
              isBot ? chatBotStyle.borderRadiusLB : chatBotStyle.borderRadiusRB,
              { backgroundColor: isBot ? msg.color : themeColors.darkCharcoal },
            ]}
          >
            {!!msg.header && (
              <Text
                style={[
                  chatBotStyle.messageHeading,
                  globalStyle.commonHeading,
                  globalFonts.poppins_500,
                  {
                    color:
                      msg.color === "#ffc107"
                        ? themeColors.black
                        : themeColors.white,
                  },
                ]}
              >
                {msg.header}
              </Text>
            )}

            {!!msg.content && (
              <Text
                style={[
                  chatBotStyle.messageText,
                  globalStyle.commonText,
                  globalFonts.poppins_500,
                  {
                    color:
                      msg.color === "#ffc107"
                        ? themeColors.black
                        : themeColors.lightGray,
                  },
                ]}
              >
                {msg.content}
              </Text>
            )}
          </View>
        )}

        <Text
          style={[
            chatBotStyle.timeText,
            globalFonts.poppins_500,
            globalStyle.commonText,
            msg.sender === 'user' && chatBotStyle.textAlignR,
            { color: isBot ? msg.color : themeColors.darkCharcoal },
          ]}
        >
          {msg.time}
        </Text>
      </View>

      {msg.sender === 'user' && (
        <Image
          source={require('@/assets/images/user.png')}
          style={chatBotStyle.chatImage}
          resizeMode="contain"
        />
      )}
    </Animatable.View>
  );
};

export default MessageBubble;

