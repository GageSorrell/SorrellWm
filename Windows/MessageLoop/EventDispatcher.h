#pragma once

#include <functional>
#include <unordered_map>
#include <vector>
#include <string>

template <typename EventType>
class FEventDispatcher
{
public:
    using ListenerID = size_t;
    using Listener = std::function<void()>;

    ListenerID RegisterListener(Listener listener)
    {
        ListenerID id = nextListenerID++;
        listeners.emplace_back(id, listener);
        return id;
    }

    void UnregisterListener(ListenerID id)
    {
        auto &listenerList = listeners[event];
        listenerList.erase(
            std::remove_if(listenerList.begin(), listenerList.end(),
                           [id](const auto &pair) { return pair.first == id; }),
            listenerList.end());
    }

    void DispatchEvent(EventType Event)
    {
        for (const auto &[id, listener] : listeners)
        {
            listener(Event);
        }
        // auto it = listeners.find(event);
        // if (it != listeners.end())
        // {
        //     for (const auto &[id, listener] : it->second)
        //     {
        //         listener();
        //     }
        // }
    }

private:
    ListenerID nextListenerID = 0;
    std::vector<std::pair<ListenerID, Listener>> listeners;
};
