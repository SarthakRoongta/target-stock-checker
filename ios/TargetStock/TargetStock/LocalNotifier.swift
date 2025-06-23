//
//  LocalNotifier.swift
//  TargetStock
//
//  Created by Sarthak Roongta on 6/23/25.
//


import UserNotifications
struct LocalNotifier {
    static func notifyIfNeeded(old: [Product], new: [Product]) {
        let oldDict = Dictionary(uniqueKeysWithValues: old.map { ($0.id, $0) })
        for prod in new where prod.inStock && !(oldDict[prod.id]?.inStock ?? false) {
            let c = UNMutableNotificationContent()
            c.title = "Item in Stock!"
            c.body  = "\(prod.name) is now available."
            c.sound = .default
            UNUserNotificationCenter.current()
                .add(UNNotificationRequest(identifier: UUID().uuidString,
                                           content: c,
                                           trigger: nil))
        }
    }
}
