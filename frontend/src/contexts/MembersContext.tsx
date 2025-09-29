"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Member, MembershipApplication, BoardMember, CreateMemberData, UpdateMemberData, CreateApplicationData, CreateBoardMemberData } from "@/lib/types/member";

interface MembersContextType {
  // Members
  members: Member[];
  membersLoading: boolean;
  membersError: string | null;
  addMember: (member: CreateMemberData) => Promise<void>;
  updateMember: (id: string, member: UpdateMemberData) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMemberById: (id: string) => Member | undefined;
  refreshMembers: () => Promise<void>;
  
  // Applications
  applications: MembershipApplication[];
  applicationsLoading: boolean;
  applicationsError: string | null;
  addApplication: (application: CreateApplicationData) => Promise<void>;
  updateApplicationStatus: (id: string, status: 'approved' | 'rejected', notes?: string, reviewedBy?: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  getApplicationById: (id: string) => MembershipApplication | undefined;
  refreshApplications: () => Promise<void>;
  
  // Board Members
  boardMembers: BoardMember[];
  boardMembersLoading: boolean;
  boardMembersError: string | null;
  addBoardMember: (boardMember: CreateBoardMemberData) => Promise<void>;
  updateBoardMember: (id: string, boardMember: Partial<CreateBoardMemberData>) => Promise<void>;
  deleteBoardMember: (id: string) => Promise<void>;
  getBoardMemberById: (id: string) => BoardMember | undefined;
  refreshBoardMembers: () => Promise<void>;
}

const MembersContext = createContext<MembersContextType | undefined>(undefined);

export function MembersProvider({ children }: { children: React.ReactNode }) {
  // Members state
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);
  
  // Applications state
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState<string | null>(null);
  
  // Board Members state
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [boardMembersLoading, setBoardMembersLoading] = useState(false);
  const [boardMembersError, setBoardMembersError] = useState<string | null>(null);

  // Fetch members
  const fetchMembers = async () => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const response = await fetch('/api/members');
      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setMembersError(err instanceof Error ? err.message : 'Failed to fetch members');
    } finally {
      setMembersLoading(false);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    try {
      const response = await fetch('/api/membership-applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setApplicationsError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Fetch board members
  const fetchBoardMembers = async () => {
    setBoardMembersLoading(true);
    setBoardMembersError(null);
    try {
      const response = await fetch('/api/board-members');
      if (!response.ok) {
        throw new Error('Failed to fetch board members');
      }
      const data = await response.json();
      setBoardMembers(data);
    } catch (err) {
      console.error('Error fetching board members:', err);
      setBoardMembersError(err instanceof Error ? err.message : 'Failed to fetch board members');
    } finally {
      setBoardMembersLoading(false);
    }
  };

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    fetchMembers();
    fetchApplications();
    fetchBoardMembers();
  }, []);

  // Member functions
  const addMember = async (memberData: CreateMemberData) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        throw new Error('Failed to create member');
      }

      const newMember = await response.json();
      setMembers(prev => [newMember, ...prev]);
    } catch (err) {
      console.error('Error creating member:', err);
      setMembersError(err instanceof Error ? err.message : 'Failed to create member');
      throw err;
    } finally {
      setMembersLoading(false);
    }
  };

  const updateMember = async (id: string, memberData: UpdateMemberData) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update member: ${errorData.error || response.statusText}`);
      }

      const updatedMember = await response.json();
      setMembers(prev => 
        prev.map(member => member.id === id ? updatedMember : member)
      );
    } catch (err) {
      console.error('Error updating member:', err);
      setMembersError(err instanceof Error ? err.message : 'Failed to update member');
      throw err;
    } finally {
      setMembersLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    setMembersLoading(true);
    setMembersError(null);
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete member: ${errorData.error || response.statusText}`);
      }

      setMembers(prev => prev.filter(member => member.id !== id));
    } catch (err) {
      console.error('Error deleting member:', err);
      setMembersError(err instanceof Error ? err.message : 'Failed to delete member');
      throw err;
    } finally {
      setMembersLoading(false);
    }
  };

  const getMemberById = (id: string) => {
    return members.find(member => member.id === id);
  };

  const refreshMembers = async () => {
    await fetchMembers();
  };

  // Application functions
  const addApplication = async (applicationData: CreateApplicationData) => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    try {
      const response = await fetch('/api/membership-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const newApplication = await response.json();
      setApplications(prev => [newApplication, ...prev]);
    } catch (err) {
      console.error('Error creating application:', err);
      setApplicationsError(err instanceof Error ? err.message : 'Failed to create application');
      throw err;
    } finally {
      setApplicationsLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected', notes?: string, reviewedBy?: string) => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    try {
      const response = await fetch(`/api/membership-applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, notes, reviewedBy }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update application: ${errorData.error || response.statusText}`);
      }

      const updatedApplication = await response.json();
      setApplications(prev => 
        prev.map(application => application.id === id ? updatedApplication : application)
      );
    } catch (err) {
      console.error('Error updating application:', err);
      setApplicationsError(err instanceof Error ? err.message : 'Failed to update application');
      throw err;
    } finally {
      setApplicationsLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    setApplicationsLoading(true);
    setApplicationsError(null);
    try {
      const response = await fetch(`/api/membership-applications/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete application: ${errorData.error || response.statusText}`);
      }

      setApplications(prev => prev.filter(application => application.id !== id));
    } catch (err) {
      console.error('Error deleting application:', err);
      setApplicationsError(err instanceof Error ? err.message : 'Failed to delete application');
      throw err;
    } finally {
      setApplicationsLoading(false);
    }
  };

  const getApplicationById = (id: string) => {
    return applications.find(application => application.id === id);
  };

  const refreshApplications = async () => {
    await fetchApplications();
  };

  // Board Member functions
  const addBoardMember = async (boardMemberData: CreateBoardMemberData) => {
    setBoardMembersLoading(true);
    setBoardMembersError(null);
    try {
      const response = await fetch('/api/board-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardMemberData),
      });

      if (!response.ok) {
        throw new Error('Failed to create board member');
      }

      const newBoardMember = await response.json();
      setBoardMembers(prev => [...prev, newBoardMember].sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error creating board member:', err);
      setBoardMembersError(err instanceof Error ? err.message : 'Failed to create board member');
      throw err;
    } finally {
      setBoardMembersLoading(false);
    }
  };

  const updateBoardMember = async (id: string, boardMemberData: Partial<CreateBoardMemberData>) => {
    setBoardMembersLoading(true);
    setBoardMembersError(null);
    try {
      const response = await fetch(`/api/board-members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(boardMemberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update board member: ${errorData.error || response.statusText}`);
      }

      const updatedBoardMember = await response.json();
      setBoardMembers(prev => 
        prev.map(boardMember => boardMember.id === id ? updatedBoardMember : boardMember)
          .sort((a, b) => a.order - b.order)
      );
    } catch (err) {
      console.error('Error updating board member:', err);
      setBoardMembersError(err instanceof Error ? err.message : 'Failed to update board member');
      throw err;
    } finally {
      setBoardMembersLoading(false);
    }
  };

  const deleteBoardMember = async (id: string) => {
    setBoardMembersLoading(true);
    setBoardMembersError(null);
    try {
      const response = await fetch(`/api/board-members/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete board member: ${errorData.error || response.statusText}`);
      }

      setBoardMembers(prev => prev.filter(boardMember => boardMember.id !== id));
    } catch (err) {
      console.error('Error deleting board member:', err);
      setBoardMembersError(err instanceof Error ? err.message : 'Failed to delete board member');
      throw err;
    } finally {
      setBoardMembersLoading(false);
    }
  };

  const getBoardMemberById = (id: string) => {
    return boardMembers.find(boardMember => boardMember.id === id);
  };

  const refreshBoardMembers = async () => {
    await fetchBoardMembers();
  };

  return (
    <MembersContext.Provider value={{
      // Members
      members,
      membersLoading,
      membersError,
      addMember,
      updateMember,
      deleteMember,
      getMemberById,
      refreshMembers,
      
      // Applications
      applications,
      applicationsLoading,
      applicationsError,
      addApplication,
      updateApplicationStatus,
      deleteApplication,
      getApplicationById,
      refreshApplications,
      
      // Board Members
      boardMembers,
      boardMembersLoading,
      boardMembersError,
      addBoardMember,
      updateBoardMember,
      deleteBoardMember,
      getBoardMemberById,
      refreshBoardMembers,
    }}>
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MembersContext);
  if (context === undefined) {
    throw new Error("useMembers must be used within a MembersProvider");
  }
  return context;
}
