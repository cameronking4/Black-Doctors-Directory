import React from 'react';
import { Text, Linking, View } from 'react-native';
import { IMLocalized } from "../Core/localization/IMLocalization";

const Links = props => {
    const { style, site, booking, instagram } = props;
    return (
        <View style={style}>
            {this.site ?
                <Text>
                    {IMLocalized("Website:")}
                </Text>
                : null}
            {this.site ?
                <Text style={{ color: 'blue' }}
                    onPress={() => Linking.openURL("http://" + site)}>
                    {site}
                </Text>
                : null}
            {this.booking ? (
                <Text>
                    {IMLocalized("Book an apt:")}
                </Text>)
                : null}
            {this.booking ? (
                <Text style={{ color: 'blue' }}
                    onPress={() => Linking.openURL("http://" + booking)}>
                    {booking}
                </Text>)
                : null}
            {this.instagram ? (
                <Text>
                    {IMLocalized("Instagram:")}
                </Text>)
                : null}
            {this.instagram ? (
                <Text style={{ color: 'blue' }}
                    onPress={() => Linking.openURL("http://instagram.com/" + instagram)}>
                    {IMLocalized("@") + instagram}
                </Text>)
                : null}
        </View>
    );
}

export default Links;