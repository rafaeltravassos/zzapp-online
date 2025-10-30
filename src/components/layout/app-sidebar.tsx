import React from 'react';
import {
	Users,
	Settings,
	Plus,
	ChevronRight,
	Search,
	Globe,
	Lock,
	Users2,
	Bookmark,
	// LayoutGrid,
	Compass,
} from 'lucide-react';
import './sidebar-overrides.css';
import { useRecentApps, useFavoriteApps, useApps } from '@/hooks/use-apps';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuAction,
	SidebarSeparator,
	SidebarFooter,
	useSidebar,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDistanceToNow, isValid } from 'date-fns';
import { AppActionsDropdown } from '@/components/shared/AppActionsDropdown';

interface App {
	id: string;
	title: string;
	framework?: string | null;
	updatedAt: Date | null;
	updatedAtFormatted?: string;
	visibility: 'private' | 'team' | 'board' | 'public';
	isFavorite?: boolean;
}

interface Board {
	id: string;
	name: string;
	slug: string;
	memberCount: number;
	appCount: number;
	iconUrl?: string | null;
}

// Reusable AppMenuItem component for consistent app display
interface AppMenuItemProps {
	app: App;
	onClick: (id: string) => void;
	variant?: 'recent' | 'bookmarked';
	showActions?: boolean;
	isCollapsed: boolean;
	getVisibilityIcon: (visibility: App['visibility']) => React.ReactNode;
}

function AppMenuItem({
	app,
	onClick,
	variant = 'recent',
	showActions = true,
	isCollapsed,
	getVisibilityIcon,
}: AppMenuItemProps) {
	const formatTimestamp = () => {
		if (app.updatedAtFormatted) return app.updatedAtFormatted;
		if (app.updatedAt && isValid(app.updatedAt)) {
			// Usando uma tradução simplificada para a distância de tempo
			return formatDistanceToNow(app.updatedAt, { addSuffix: true, locale: { formatDistance: () => 'tempo atrás' } as any });
		}
		return 'Recentemente'; // <- TRADUÇÃO: Recently
	};

	return (
		<SidebarMenuItem className="group/app-item">
			<SidebarMenuButton
				asChild
				tooltip={app.title}
				className="cursor-pointer transition-opacity hover:opacity-75 pr-0"
			>
				<a
					href={`/app/${app.id}`}
					onClick={(e) => {
						e.preventDefault();
						onClick(app.id);
					}}