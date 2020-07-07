import React from 'react';
import { Text, Linking, View } from 'react-native';
import { IMLocalized } from '../../localization/IMLocalization';

const Links = props => {
    const { site, booking, instagram, style } = props;
    return (
        <View style={style}>
            <Text>
                {IMLocalized("Website:")}
            </Text>
            <Text style={{ color: 'blue', fontSize: 12 }}
                onPress={() => Linking.openURL("http://" + site)}>
                {site}
            </Text>
            <Text>
                {IMLocalized("Book an apt:")}
            </Text>
            <Text style={{ color: 'blue', fontSize: 12 }}
                onPress={() => Linking.openURL("http://" + booking)}>
                {booking}
            </Text>
            <Text>
                {IMLocalized("Instagram:")}
            </Text>
            <Text style={{ color: 'blue', fontSize: 12 }}
                onPress={() => Linking.openURL("http://instagram.com/" + instagram)}>
                {IMLocalized("@") + instagram}
            </Text>
        </View>
    );
}

export default Links;